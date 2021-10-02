package com.example.library.model.UserToken;

import java.util.Date;

import com.example.library.model.User;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import javax.persistence.metamodel.StaticMetamodel;

@Entity
@Table(name = "userTokens")
@StaticMetamodel(UserToken.class)
@Setter
@ToString
@NoArgsConstructor
public class UserToken {

    @EmbeddedId
    TokenKey id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("id")
    @JoinColumn(name = "user_id")
    User user;

    @Column(name="tokenStringValue")
    String tokenStringValue;

    @Column(name="active")
    Boolean active;

    @Column(name="expirationDate")
    Date expirationDate;

    public UserToken(User user, String tokenStringValue, Boolean active, Date createdAt, Date expirationDate) {
        this.user = user;
        this.tokenStringValue = tokenStringValue;
        this.active = active;
        this.expirationDate = expirationDate;
        this.id = new TokenKey(user.getId(), createdAt);
    }
}
